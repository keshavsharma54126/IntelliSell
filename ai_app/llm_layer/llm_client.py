import os

from anthropic import Anthropic
from llm_layer.llm_prompts import generate_distance_aware_prompt, general_response_prompt, is_context_independent
from CONSTANTS import ANTHROPIC_API_KEY, ANTHROPIC_LLM as llm_model_name

class ClaudeLLM:

    def __init__(self):
        self.client = Anthropic(
            api_key=os.getenv(ANTHROPIC_API_KEY)
        )

    def is_query_context_independent(self, user_query: str):
        """
        This function leverages prompts and user's query to decide whether it is contextually
        independent, dependent or ambiguous in nature

        :param user_query: User's input message
        :return: Context clarity
        """

        # Designing accurate prompt for better understanding and decision making
        prompt = is_context_independent(user_query=user_query)

        # Triggering the LLM for final decision
        response = self.client.messages.create(
            model=llm_model_name,
            max_tokens=400,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        # Extracting and returning the generated answer from LLM response
        llm_response = response.content[0].text

        return llm_response

    def generate_response(self, user_query: str, query_results:list[dict]):
        """
        This function leverages dynamic prompts, query results and user's message to generate
        the best possible response for user

        :param user_query: User's input message
        :param query_results: Semantically matching results
        :return: LLM generated answer
        """

        # Manufacturing robust and dynamic prompt for curated response generation
        prompt = generate_distance_aware_prompt(
            user_query=user_query,
            query_results=query_results
        )

        # Generating the final answer
        response = self.client.messages.create(
            model=llm_model_name,
            max_tokens=1000,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        # Extracting and returning the generated answer from LLM response
        llm_response = response.content[0].text

        return llm_response


    def generate_conversational_response(self, user_query: str):
        """
        General use-case function, for generating casual responses

        :param user_query: User's input message
        :return: LLM response
        """

        # Using the general prompt for casual conversation
        prompt = general_response_prompt(user_query=user_query)

        # Generating response from LLM
        response = self.client.messages.create(
            model=llm_model_name,
            max_tokens=300,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        # Extracting and returning the generated answer from LLM response
        llm_response = response.content[0].text

        return llm_response





