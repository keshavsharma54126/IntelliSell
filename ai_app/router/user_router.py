from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse

from data_handling.user_operation import generate_query_response
from database_layer.milvus_client import MilvusDB
from llm_layer.llm_client import ClaudeLLM
from schemas.schema import UserText
from utilities.startup import startup_utilities

router  = APIRouter(
    prefix='/user'
)

@router.post('/get-query-response', tags=['user'])
async def get_query_response(user_text: UserText,
                       vector_db: MilvusDB = Depends(startup_utilities.get_vector_database_client),
                       llm_client: ClaudeLLM = Depends(startup_utilities.get_llm_client)):
    """
    This router-end-point functions to intuitively approach the answer generation process, keeping in
    consideration all the architectural analogies involved in the process

    :param user_text: Request body containing user's message
    :param vector_db: Vector database session instance
    :param llm_client: LLM client session instance
    :return: Intelligent Response pertaining to user message
    """
    try:
        # Extracting the user message/query from the request-body
        # form = await request.form()
        # user_query = form.get('Body')
        user_query = user_text.message

    # Handling any unprecedented exceptions
    except Exception as e:
        print(f"Unable to extract user message from request\n.Error Stack Trace:\n{e}")
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content="Unable to extract user message from request"
        )
    try:
        # Deploying the LLM to generate the best possible response
        llm_response = generate_query_response(user_query = user_query, vector_db=vector_db, llm_client=llm_client)

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content=str(llm_response),
        )

    # Handling any exceptions met in the process
    except Exception as e:
        print(f"Error Occurred while generating response.\nError Stack Trace\n{e}")
        return JSONResponse(
            status_code=status.HTTP_417_EXPECTATION_FAILED,
            content="Error Occurred while generating response"
        )
