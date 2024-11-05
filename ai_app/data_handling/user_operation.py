from fastapi import status
from fastapi.responses import JSONResponse

from CONSTANTS import CLIENT_DATA_COLLECTION as collection_name, CACHED_QUESTION_ANSWERS, field_name_document
from CONSTANTS import metadata_field_cache, INVALID_RESPONSE, CACHED_QUESTION_ANSWERS
from database_layer.milvus_client import MilvusDB
from llm_layer.llm_client import ClaudeLLM
from service_layer.vector_db_service import query_documents_in_db, add_to_collection


def generate_query_response(user_query: str, vector_db: MilvusDB, llm_client: ClaudeLLM):
    """
    This functions comprehends the context of the user's message and decides the course
    of answer generation/curation through a robust architecture

    :param user_query: User input message received
    :param vector_db: Vector database session instance
    :param llm_client: LLM client session instance
    :return: Response to the user
    """

    # Ensuring edge-case check for non-empty text
    if user_query == "":
        return JSONResponse(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            content="Query Can Not Be Empty"
        )

    try:
        # Checking whether query is context independent or requires additional information
        is_independent = llm_client.is_query_context_independent(user_query=user_query)

        # 1. If the user's query is independent, we can straight away search in cached questions
        if is_independent == "True" and vector_db.collection_exists(collection_name=CACHED_QUESTION_ANSWERS):
            print(f"User Query: {user_query} is INDEPENDENT")
            cache_results = search_question_in_cache(
                user_query=user_query,
                vector_db=vector_db,
            )
            print(f"Cached Questions Retrieval: {cache_results}")
            # 2. Limit Answers and Place Threshold Checks for better semantic matching
            # 3. Check Previous Conversation Summary, if threshold fails
            # 4. Check for additional filtering/measures if needed

        elif is_independent == "Unable to decide":
            print(f"User Query: {user_query} is AMBIGUOUS")
            # Hmmm
            pass

        else:
            print(f"User Query: {user_query} is DEPENDENT")
            # 1. Check Previous Conversation Summary
            pass

        # Performing query operation if cache does not prove useful
        query_results = query_documents_in_db(
            collection_name=collection_name,
            user_query=user_query,
            vector_db=vector_db,
            output_fields=[field_name_document]
        )

        # Structuring the query results in accordance with response architecture
        formatted_query_results = parse_query_results(query_results=query_results[0])

        # Final answer generation using or ignoring previous summary
        llm_response = llm_client.generate_response(
            user_query=user_query,
            query_results=formatted_query_results
        )

        # If the response does not contain invalid response, only then we proceed to add to db
        if not INVALID_RESPONSE in llm_response:
            add_to_collection(
                collection_name=CACHED_QUESTION_ANSWERS,
                document=[user_query],
                metadata=[
                    {
                        metadata_field_cache: llm_response
                    }
                ],
                vector_db=vector_db
            )


        # For general conversation with LLM, un-restricted by any topic
        # llm_response = llm_client.generate_conversational_response(user_query=user_query)

        return llm_response

    except Exception as e:
        raise ValueError("Unable to generate response for user query")

def enhance_answer_generation(is_independent: bool, vector_db: MilvusDB):

    if is_independent == "True" and vector_db.collection_exists(collection_name=CACHED_QUESTION_ANSWERS):
        """
        Search in cached questions
        If the results are above a certain threshold, we will take the best matching result
        Feed the best results, the current question, and let LLM reframe the answer accordingly
        NOTE: Take token length into consideration at all costs!
        """
    else :
        """
        Check if previous summary exists, if not ask user to re-frame question
        Feed the current question and summary, and try to replace the pronouns with subjects
        If replaced, again do a check in cache
        """

def search_question_in_cache(user_query: str, vector_db: MilvusDB):
    """
    This function, does a lookup for any semantically matching cached questions with
    the user's input message

    :param user_query: User's input message
    :param vector_db: Vector database session instance
    :return: Semantically matching results
    """

    # Ensuring that the collection exists
    if not vector_db.collection_exists(collection_name=collection_name):
        raise ValueError("Collection does not exist!")

    # Performing and returning results from query operation in cache collection
    query_result = vector_db.query_db(
        collection_name=CACHED_QUESTION_ANSWERS,
        query=user_query,
        output_fields=[field_name_document, metadata_field_cache]
    )
    return query_result[0]

def parse_query_results(query_results: list[dict]):
    """
    This function, creates an apprehensive structure from the query results obtained for
    further processing and response generation

    :param query_results: Query Results from Database
    :return: Formatted result Structure
    """
    formatted_query_results = []

    for result_dict in query_results:

        if 'distance' in result_dict and field_name_document in result_dict.get('entity', {}):
            current_dict = {
                'distance': result_dict['distance'],
                field_name_document: result_dict.get('entity')[field_name_document]
            }
            formatted_query_results.append(current_dict)

    return formatted_query_results



