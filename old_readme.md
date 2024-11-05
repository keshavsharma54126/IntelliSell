
# WhatsApp Ai sales


This project is a WhatsApp-based chatbot solution designed for product sellers to engage with their customers efficiently. The chatbot automates customer communication by sending messages to users via WhatsApp, providing updates on products, order status, promotions, and personalized offers. It integrates with the seller's product catalog and customer database, allowing real-time responses to customer inquiries, sending reminders, and managing support queries. The goal is to enhance customer engagement, boost sales, and streamline communication with minimal manual intervention.


## Getting Started:

### Setting up next-app locally

First clone the repository locally, by running the following command







```bash
git clone https://github.com/codes30/whatsapp-ai-sales.git
```

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



## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_URL`

`NEXTAUTH_URL`

`NEXTAUTH_SECRET`

`AWS_REGION`

`AWS_ACCESS_KEY_ID`

`AWS_SECRET_ACCESS_KEY`

`AWS_S3_BUCKET_NAME`


## Appendix

Any additional information goes here

```AWS_ACCESS_KEY_ID``` and ```AWS_SECRET_ACCESS_KEY``` is generate from the IAM user

give ```CORS``` permission to the local server where app is running.

Also give ```Access``` permission to the IAM user by setting up ```polices``` 
