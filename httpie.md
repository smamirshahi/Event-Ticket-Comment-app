# create an event
- http post :4000/addevent title="event3" description="desc3" picture="pic3" start="start3" end="end3"

# get the JWT and use the Authorization
- http post :4000/logins email="smamirshahi@gmail.com" password="123456789"
<!-- you receive the JWT. copy it as local: JWT="..." -->
<!-- now you can use it to do whatever you want when the code needs authorization. such as: -->
- http get :4000/users Authorization:"Bearer $JWT"


