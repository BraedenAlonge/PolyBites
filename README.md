# PolyBites
Cal Poly's Local Food-Rating App

[ER Diagram](https://lucid.app/lucidchart/ad2813b3-f982-40c2-aa4c-77191e8797b9/edit?viewport_loc=185%2C-109%2C2331%2C1015%2C0_0&invitationId=inv_e40c3701-01f5-4a56-b124-3bbf4631b53e)


## Database Config
In polybites-backend, create a .env file. Add the following line with no extra characters or spaces:
DATABASE_URL=postgres://postgres.[TRANSAC-POOLER]:[PASSWORD]@aws-0-us-east-2.pooler.supabase.com:6543/postgres

Your URL may be different. Copy the specific transaction pooler [TRANSAC-POOLER] connection part in the link under:
Connect -> Transaction Pooler
To get the PASSWORD:
Project Settings -> Configuration -> Database -> Database Password -> Reset database password
Copy and paste the password into the URL

IMPORTANT: Make sure that you add a .gitignore file and paste the following inside:
.env
