# David Sumsion & Carlee Hansen Peer Attack

## Self Attack

### David:

#### Poor Design w/ purchasing pizzas
| Item           | Result                                                                         |
| -------------- | ------------------------------------------------------------------------------ |
| Date           | April 9, 2025                                                                  |
| Target         | pizza.pizza324.click                                                           |
| Classification | Poor Design                                                                    |
| Severity       | 1                                                                              |
| Description    | Able to purchase pizzas for any price if call is intercepted in BurpSuite and changed!!    |
| Image          | ![Admin Login](purchasePizzas.png)  <br/>                                            |
| Corrections    | Called DB and verified the price from the front end matched the database before allowing user to purchase                |

#### Brute Force
```
Note: I decided not to officially run this command on my own server to avoid AWS charges.
```
| Item           | Result                                                                         |
| -------------- | ------------------------------------------------------------------------------ |
| Date           | April 9, 2025                                                                  |
| Target         | pizza.pizza324.click                                                           |
| Classification | Brute Force Attempts/DDOS                                                      |
| Severity       | 2                                                                              |
| Description    | Able to brute force call the authentication credentials repetetely. Could DDOS |
| Corrections    | Allow a few requests per IP address per minute                                 |

#### Default Credentials
| Item           | Result                                                                         |
| -------------- | ------------------------------------------------------------------------------ |
| Date           | April 9, 2025                                                                  |
| Target         | pizza.pizza324.click                                                           |
| Classification | Default Credentials                                                            |
| Severity       | 1                                                                              |
| Description    | Able to delete (close) any/all stores/franchises as well as make any franchise/store     |
| Image          | ![Admin Login](adminLogin.png)  <br/>                                            |
| Corrections    | Removed default credentials, made new ones, and wiped DB                       |


### Carlee:

#### SQL Injection
Item            | Result
----------------|--------
Date            | April 13, 2025
Target          | pizza.carlee329.click
Classification  | Injection
Severity        | 1
Description     | Sent PUT /api/auth/1%20OR%201=1 as diner using Repeater and Intruder. Originally updated all users’ emails, confirming SQL injection in updateUser. After fix, received 403 Forbidden, and verified other users’ emails unchanged.
Images          | [1.png]
Corrections     | Parameterized userId in updateUser query in database.js.


#### Broken Access Control
Item            | Result
----------------|--------
Date            | April 13, 2025
Target          | pizza.carlee329.click
Classification  | Broken Access Control
Severity        | 4 (Low)
Description     | Sent PUT /api/chaos/true as diner using Repeater. Received 200 OK with {"chaos":false}, indicating non-admins can access the endpoint but not enable chaos.
Images          | [2.png]
Corrections     | Updated orderRouter.js to return 403 for non-admins. Retested and confirmed 403 Forbidden.

#### Identification and Authentication Failures

Item            | Result
----------------|--------
Date            | April 13, 2025
Target          | pizza.carlee329.click
Classification  | Identification and Authentication Failures
Severity        | 3 (Medium)
Description     | Decoded JWT from PUT /api/auth using Burp Suite Decoder. Lacked exp claim, allowing indefinite use if stolen.
Images          | [3.png]
Corrections     | Added { expiresIn: '1h' } to jwt.sign in authRouter.js. Retested with 5-second expiration, confirmed 401 Unauthorized after expiry.




## Peer Attack
```
Note: We previously agreed before the peer attack to not do any brute force attacks as to not incur extra charges on our AWS accounts
```
### David:

#### Poor Design w/ purchasing pizzas
| Item           | Result                                                                         |
| -------------- | ------------------------------------------------------------------------------ |
| Date           | April 14, 2025                                                                  |
| Target         | pizza.carlee329.click                                                          |
| Classification | Poor Design                                                                    |
| Severity       | 1                                                                              |
| Description    | Able to purchase pizzas for any price if call is intercepted in BurpSuite and changed!! Purchased up to 20 pizzas at a time for free   |
| Image          | ![Admin Login](freePizzas.png)  <br/>                                            |
| Image          | ![Admin Login](freeVerified.png)  <br/>                                            |
| Corrections    | Call DB to verify if there are any differences between the menu items and the title and price              |

#### Default Credentials
| Item           | Result                                                                         |
| -------------- | ------------------------------------------------------------------------------ |
| Date           | April 14, 2025                                                                  |
| Target         | pizza.carlee329.click                                                         |
| Classification | Default Credentials                                                            |
| Severity       | 1                                                                              |
| Description    | Able to delete (close) any/all stores/franchises as well as make any franchise/store     |
| Image          | ![Before Admin Login](beforeAdmin.png)  <br/>                                            |
| Image          | ![After Admin Login](afterAdmin.png)  <br/>                                            |
| Corrections    | Change default credentials of Admin                     |


### Carlee:

#### Identification and Authentication Failures

Item            | Result
----------------|--------
Date            | April 13, 2025
Target          | pizza.pizza324.click 
Classification  | Identification and Authentication Failures
Severity        | 2
Description     | Decoded JWT from PUT /api/auth using Burp Suite Decoder. Lacked exp claim, allowing indefinite use if stolen.
Images          | [4.png]
Corrections     | Needs to add { expiresIn: '1h' } to jwt.sign in authRouter.js. 

#### Broken Access Control
Item            | Result
----------------|--------
Date            | April 13, 2025
Target          | pizza.carlee329.click
Classification  | Broken Access Control
Severity        | 4 (Low)
Description     | Sent PUT /api/chaos/true as diner using Repeater. Received 200 OK with {"chaos":false}, indicating non-admins can access the endpoint but not enable chaos.
Images          | [5.png]
Corrections     | Updated orderRouter.js to return 403 for non-admins. Retested and confirmed 403 Forbidden.



## Combined Summary of Learnings
```
Penetration testing was a fun and informative learning experience. In each of our self attacks we identified various vulnerablilites including Brute Force Attacks, Poor Design, Default Credentials, Broken Access controls, Identification and Authentication Failures, and SQL Injections. When attacking eachothers websites we found that both of our websites were largely safeproofed against attacks after doing our own, other than two attacks. Overall, we discovered that a website seemingly perfect could contain hidden but massive issues once a system has consistent users when a may overlooked or shortcut development.
```