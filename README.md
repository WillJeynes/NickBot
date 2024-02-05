# Nickbot
A discord bot that allows others to change your name, but does not allow people to change their own
```
$nick @user nickname
```
## Install
Create the sqlite3 database
```sql
CREATE TABLE "key" (
	"key"	TEXT
)
```
With your discord key as the first row


```sql
CREATE TABLE "names" (
	"GuildID"	TEXT NOT NULL,
	"UserID"	TEXT NOT NULL,
	"Nickname"	TEXT NOT NULL
)
```
For the intended nicknames