
# WhatsApp AI Sales


This project is a WhatsApp-based chatbot solution designed for product sellers to engage with their customers efficiently. The chatbot automates customer communication by sending messages to users via WhatsApp, providing updates on products, order status, promotions, and personalized offers. It integrates with the seller's product catalog and customer database, allowing real-time responses to customer inquiries, sending reminders, and managing support queries. The goal is to enhance customer engagement, boost sales, and streamline communication with minimal manual intervention.


## Getting Started:

First clone the repository locally, by running the following command







```bash
git clone https://github.com/codes30/whatsapp-ai-sales.git
```

### Next App Setup

Next step, cd inside the repo. run the following

```bash
cd whatsapp-ai-sales/next-app
```

Next, install all the dependency. run the following.
Using ```npm``` to install the packages

```bash
npm i
```
To start the project locally in development mode, run.

```bash
npm run dev
```


### FastAPI Runtime Setup

From repository root, cd inside the ai_app directory


```bash

cd whatsapp-ai-sales/ai_app

```

Then, create a virtual environment for all project dependencies

```bash
python -m venv your-env-name
```

Activate your virtual environment, for macOS

```bash
source your-env-name/bin/activate
```

For Windows

```bash
your-env-name/Scripts/activate
```

Install the project dependencies in your environment using 'requirements.txt'

```bash
pip install -r requirements.txt
```

Run the server in development mode

```bash
python main.py
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_URL`

`NEXTAUTH_URL`

`NEXTAUTH_SECRET`

`AWS_REGION`

`AWS_ACCESS_KEY_ID`

`AWS_SECRET_ACCESS_KEY`

`AWS_S3_BUCKET_NAME`

`zilliz_milvus_uri`

`zilliz_milvus_token`

`llm_api_key`

`account_sid`

`auth_token`

`user_contact`

`client_contact`


## Appendix

Any *additional information* goes here

For **FastAPI** runtime

You need to configure a vector database on zilliz cloud and generate a ```zilliz_milvus_uri```
and a ```zilliz_milvus_token```

**LLM** Configuration

For now, the supported LLM is **claude-sonnet-3.5** model only. So, configure the ```llm_api_key``` accordingly from
claude anthropic official website

For **Twilio**,

```account_sid``` and ```auth_token``` are provided post sign-up

The on-boarded user and client details have to be provided as ```user_contact``` and ```client_contact```
respectively



```AWS_ACCESS_KEY_ID``` and ```AWS_SECRET_ACCESS_KEY``` is generate from the IAM user

give ```CORS``` permission to the local server where app is running.

Also give ```Access``` permission to the IAM user by setting up ```polices``` 

