import os
from dotenv import load_dotenv
from langchain import LLMChain
from langchain.prompts import PromptTemplate
from langchain_google_genai import GoogleGenerativeAI  # type: ignore

# Load environment variables from .env
load_dotenv()

def get_report_chain():
    # Initialize the Google Gemini LLM with your API key
    llm = GoogleGenerativeAI(
        model="gemini-1.5-flash",
        google_api_key=os.environ.get("GOOGLE_API_KEY"),
        temperature=0.2,
    )
    
    # Define a prompt template for summarizing SQL query results
    prompt = PromptTemplate(
        input_variables=["query", "result"],
        template=(
            "Given the following SQL query:\n"
            "{query}\n\n"
            "and its results:\n"
            "{result}\n\n"
            "Write a clear, concise report summarizing the data in natural language."
        )
    )
    
    # Create the chain with LLM and prompt
    report_chain = LLMChain(llm=llm, prompt=prompt)
    return report_chain

if __name__ == "__main__":
    # Example usage:
    sql_query = "SELECT COUNT(*) FROM patients_patient WHERE registration_date >= NOW() - INTERVAL '1 day' AND registration_date < NOW();"
    sql_result = [(18,)]  # Example raw SQL result

    chain = get_report_chain()
    report = chain.run(query=sql_query, result=sql_result)
    print("Generated report:\n", report)
