from dotenv import load_dotenv
from database_layer.milvus_db import MilvusDB

load_dotenv()

milvus_client = MilvusDB(db_name="cache_test.db")
milvus_client.create_collection(collection_name="cached_question_answers")
documents = [
    "What is Machine Learning?",
    "What is Artificial Intelligence"
]
metadata = [
    {
        'answer': "Machine Learning is a field of Data Science."
    },
    {
        'answer': "Artificial Intelligence is the superset of Machine Learning"
    }
]
milvus_client.add_to_db(
    collection_name="cached_question_answers",
    document=documents,
    metadata=metadata
)