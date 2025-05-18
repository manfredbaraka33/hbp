# from langchain.prompts import SemanticSimilarityExampleSelector, FewShotPromptTemplate, PromptTemplate
# from langchain_google_genai import GoogleGenerativeAI # type: ignore
# from langchain.chains.sql_database.prompt import PROMPT_SUFFIX
# from langchain_experimental.sql import SQLDatabaseChain # type: ignore
# from langchain.utilities import SQLDatabase
# from langchain.vectorstores import Chroma
# from langchain.embeddings import HuggingFaceEmbeddings
# import os
# from dotenv import load_dotenv
# from .few_shots import few_shots  

# load_dotenv()

# def get_hbp_few_shot_db_chain():
#     db_user = "postgres"
#     db_password = "1234"
#     db_name = "hbp"
#     db_host = "localhost"
#     db_port = "5432"

#     uri = f"postgresql+psycopg2://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
#     db = SQLDatabase.from_uri(uri)

#     llm = GoogleGenerativeAI(
#         model="gemini-1.5-flash",
#         google_api_key=os.environ["GOOGLE_API_KEY"],
#         temperature=0.1
#     )

#     embeddings = HuggingFaceEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')
#     to_vectorize = [" ".join(example.values()) for example in few_shots]
#     vectorstore = Chroma.from_texts(to_vectorize, embeddings, metadatas=few_shots)

#     example_selector = SemanticSimilarityExampleSelector(
#         vectorstore=vectorstore,
#         k=2,
#     )

#     custom_prompt_prefix = """You are a PostgreSQL expert for a Hepatitis B patient data system.
# Given an input question, create a valid SQL query, run it, and return a clear final answer.

# Follow this format:

# Question: Question here
# SQLQuery: SQL to run
# SQLResult: Result of the SQLQuery
# Answer: Final answer here
# """

#     example_prompt = PromptTemplate(
#         input_variables=["Question", "SQLQuery", "SQLResult", "Answer"],
#         template="\nQuestion: {Question}\nSQLQuery: {SQLQuery}\nSQLResult: {SQLResult}\nAnswer: {Answer}",
#     )

#     few_shot_prompt = FewShotPromptTemplate(
#         example_selector=example_selector,
#         example_prompt=example_prompt,
#         prefix=custom_prompt_prefix,
#         suffix=PROMPT_SUFFIX,
#         input_variables=["input", "table_info", "top_k"],
#     )

#     chain = SQLDatabaseChain.from_llm(llm, db, verbose=True, prompt=few_shot_prompt)
#     return chain




from langchain.prompts import SemanticSimilarityExampleSelector, FewShotPromptTemplate, PromptTemplate
from langchain_google_genai import GoogleGenerativeAI  # type: ignore
from langchain.chains.sql_database.prompt import PROMPT_SUFFIX
from langchain_experimental.sql import SQLDatabaseChain  # type: ignore
from langchain.utilities import SQLDatabase
from langchain.vectorstores import Chroma
from langchain.embeddings import HuggingFaceEmbeddings
import os
from dotenv import load_dotenv
from .few_shots import few_shots  # your few-shot examples list or dict

load_dotenv()  # loads .env file to os.environ


def load_or_create_vectorstore(embedding_model, examples, persist_dir="chromadb_hbp_fewshots"):
    """
    Load existing chroma vectorstore if exists; otherwise create from examples.
    examples should be a list of dicts (each with keys like Question, SQLQuery, etc).
    """
    to_vectorize = [" ".join(example.values()) for example in examples]

    if os.path.exists(persist_dir) and len(os.listdir(persist_dir)) > 0:
        print("Loading existing vectorstore from", persist_dir)
        print("[LOG] ✔✔✔Loading existing vectorstore from disk (few-shots embeddings already done).✔✔✔✔✔✔✔ ")
        return Chroma(persist_directory=persist_dir, embedding_function=embedding_model)
    else:
        print("Creating new vectorstore and persisting to", persist_dir)
        print("[LOG] 🤦‍♂️🤦‍♂️🤦‍♂️👉🔥🔥🔥 Creating vectorstore: embedding few-shot examples now...")
        vectorstore = Chroma.from_texts(
            to_vectorize,
            embedding_model,
            metadatas=examples,
            persist_directory=persist_dir
        )
        vectorstore.persist()
        return vectorstore


def get_hbp_few_shot_db_chain():
    """
    Returns a configured SQLDatabaseChain using Google Gemini LLM with
    few-shot prompting and semantic similarity example selector.
    """

    # PostgreSQL connection details - update with your real creds if needed
    db_user = "postgres"
    db_password = "1234"
    db_name = "hbp"
    db_host = "localhost"
    db_port = "5432"

    # Build the DB URI and create SQLDatabase instance
    uri = f"postgresql+psycopg2://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
    db = SQLDatabase.from_uri(uri)

    # Initialize Google Gemini LLM
    llm = GoogleGenerativeAI(
        model="gemini-1.5-flash",
        google_api_key=os.environ["GOOGLE_API_KEY"],
        temperature=0.1
    )

    # Load embeddings and create/load vectorstore for few-shot examples
    embeddings = HuggingFaceEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')
    vectorstore = load_or_create_vectorstore(embeddings, few_shots)

    # Create semantic similarity example selector for few-shot prompting
    example_selector = SemanticSimilarityExampleSelector(
        vectorstore=vectorstore,
        k=2,  # number of examples to select
    )

    # Custom prompt prefix explaining the task
    custom_prompt_prefix = """You are a PostgreSQL expert for a Hepatitis B patient data system.
Given an input question, create a valid SQL query, run it, and return a clear final answer.
Do NOT include markdown formatting or code fences (no triple backticks) in your SQLQuery or output.

Use PostgreSQL syntax for date and interval operations. For example, to get date 18 years ago, use:
CURRENT_DATE - INTERVAL '18 years'
Do NOT use SQLite syntax like date('now', '-18 years').
Follow this format:

Question: Question here
SQLQuery: SQL to run
SQLResult: Result of the SQLQuery
Answer: Final answer here
"""

    # Prompt template for each example (matches few_shots structure)
    example_prompt = PromptTemplate(
        input_variables=["Question", "SQLQuery", "SQLResult", "Answer"],
        template="\nQuestion: {Question}\nSQLQuery: {SQLQuery}\nSQLResult: {SQLResult}\nAnswer: {Answer}",
    )

    # FewShotPromptTemplate that uses the example selector to choose relevant examples
    few_shot_prompt = FewShotPromptTemplate(
        example_selector=example_selector,
        example_prompt=example_prompt,
        prefix=custom_prompt_prefix,
        suffix=PROMPT_SUFFIX,  # from langchain_chains.sql_database.prompt
        # **Important:** the input variable here must be "Question" to match prefix/suffix
        input_variables=["Question", "table_info", "top_k"],
    )

    # Build and return the SQLDatabaseChain with the few-shot prompt
    chain = SQLDatabaseChain.from_llm(llm, db, verbose=True, prompt=few_shot_prompt)

    return chain
