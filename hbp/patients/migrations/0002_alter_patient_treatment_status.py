# Generated by Django 5.2 on 2025-04-28 07:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('patients', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='patient',
            name='treatment_status',
            field=models.CharField(choices=[('ongoing', 'On going'), ('completed', 'Completed'), ('followup', 'Follow up')], default='ongoing', max_length=20),
        ),
    ]
