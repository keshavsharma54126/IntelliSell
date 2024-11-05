import numpy as np

def check_query_is_valid(user_query: str):
    pass

def is_context_independent(user_query: str):
    prompt = f"""
            You have to decide whether the sentence passed is contextually independent or dependent.
            If it is contextually independent, reply True.
            If there is any dependency and the sentence is indirectly referring to an event which is not explicitly
            mentioned, reply False.
            Only and only respond with True or False. If you are unable to decide, respond "Unable to decide".
            Do not respond other than these three responses under any circumstance.

            Sentence: "Why is React the better choice?"
            Response : False (Better choice than what?)

            Sentence: "This looks interesting, can I know more?"
            Response: False (What is interesting? Know more about what?)

            Sentence: "What are the steps involved in Data Mining?"
            Response: True (No hidden/implicit references)

            Sentence: "What is Machine Learning?"
            Response: True

            Sentence: "Why are the last two points mentioned?"
            Response: False (What last two points?)

            Sentence: "Is Harkirat Singh of Indian Origin?"
            Response: True

            Sentence: "What is the maximum discount I can get?"
            Response: False (maximum discount on what?)

            Sentence: "Will it rain today?"
            Response: True (general question with no implicit external reference)

            Sentence: {user_query}
            Response: 
            """
    return prompt

def generate_distance_aware_prompt(user_query: str, query_results: list[dict]):
    query_results, relevance_scores = create_distance_aware_results(query_results=query_results)

    template = f"""
    You are a friendly and helpful assistant, tasked with answering questions based solely on the provided data. 
    Your role is to analyze the search results and relevance scores to answer the question below.

    Question: {user_query}
    
    """
    template = modify_prompt(
        template=template,
        query_results=query_results,
        relevance_scores=relevance_scores
    )

    template += """
    Instructions:
    - If you don't find relevant information, apologize to the user and politely ask the user to ask relevant questions only. Always begin your apology with "I apologize, but I don't have relevant information about". Do not engage your own answer for own insights.
    - Review the provided information, giving more weight to results with higher relevance scores.
    - Formulate a short, crisp and concise answer (20-30 words maximum, unless explicitly asked for a detailed response).
    - Summarize where necessary and ask for more details if you don’t have enough information.
    - Make logical inferences based on the provided context, but do not introduce external information.
    - If there are contradictions in the results, address them and explain how you resolve these inconsistencies.
    - Do not mention Relevance Scores or Search Results explicitly to the user.
    - Respond naturally, as if you yourself are answering.
    
    Response:
    """
    return template


def create_distance_aware_results(query_results: list[dict]):
    # Sort results by distance (ascending)
    query_results.sort(key=lambda x: x['distance'])

    # Limit results to top 3
    formatted_query_results = query_results[:3]

    # Calculate relevance scores
    distances = np.array([r['distance'] for r in query_results])
    max_distance = np.max(distances)
    relevance_scores = 1 - (distances / max_distance)

    return formatted_query_results, relevance_scores

def modify_prompt(template: str, query_results: list[dict], relevance_scores):
    for i, (result, relevance) in enumerate(zip(query_results, relevance_scores), 1):
        template += f"\n{i}. Relevance Score: {relevance:.2f}\n"
        template += f"   Content: {result['text']}\n"
    return template

def general_response_prompt(user_query: str):
    template = f"""
    You are a chatbot named 'Jarvis'. When generating a response to a user's query, first analyze the tone, style, and language of the user's input. Then, craft your reply to match their tone and style while ensuring clarity, accuracy, and helpfulness.

    Guidelines:
    - Tone Matching: Match the user's formality, enthusiasm, etc.
    - Language Style: Reflect the user's word choices and formality.
    - Emotional Alignment: Acknowledge emotions like excitement or frustration and respond appropriately.
    
    User: {user_query}
    """
    return template
