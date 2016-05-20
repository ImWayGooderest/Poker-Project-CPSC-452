import RSA, requests, sys, json, base64

#global vars for now
private_key = b""
public_key = b""

# methods of response object
# r.text text
# r.content binary content
# r.json json

# >>> payload = {'key1': 'value1', 'key2': 'value2'}
#
# >>> r = requests.post("http://httpbin.org/post", data=payload)
# >>> print(r.text)
# {
#   ...
#   "form": {
#     "key2": "value2",
#     "key1": "value1"
#   },
#   ...
# }
# def getHand():
# 	hand = requests.get("http://localhost:3000/getHand")
# 	print(hand.json())
# 	return hand.json()
def decryptBase64toJSON(bytes):
	cipher = RSA.RSA()
	JSONstring = cipher.decrypt(base64.b64decode(bytes), private_key).decode("utf-8")
	return json.loads(JSONstring)

def loginAndGetHand():
	hand = requests.post("http://localhost:3000/login", json=prepareData())
	# print("Hand returned was: " + hand.content)
	return decryptBase64toJSON(hand.content)

def playCard(card):
	data = {}
	data['card'] = card
	newHand = requests.post("http://localhost:3000/sendCard", json=prepareData(data))
	# print("sendCard returned: " + result.json())
	return decryptBase64toJSON(newHand.content)

# attaches session key only accepts dicts for now
def prepareData(data=None):
	if(data==None):
		data = {}
	data["session_key_base64"] = base64.b64encode(public_key).decode()
	return data

def main():
	global public_key, private_key
	cipher = RSA.RSA()
	private_key, public_key = cipher.getKey()
	myHand = loginAndGetHand()
	# test stuff
	while len(myHand) > 0:
		userInput = input("This is currently your hand, please select one: " + str(myHand)) #probably a better way to write this
		myHand = playCard(myHand[int(userInput)]) # need




		# playCard(userInput)		#have the user input be passed on to the server
		#counter += 1
		#userInput = input("Get another hand?" Yes or No?)
		#if (userInput == "Yes"):
			#myHand = base64.b64decode(bytes(getHand(), encoding="ascii")) #Need new function simply for getting the hand and encoding it separate from logging in the first time
	#userInput = input("Would you like to find who won?")
	#if (userInput == "Yes"):
		#winner = request.post("http://localhost:3000/findWinner", json=prepareData())
		#print("The winner was:" + winner)




if __name__ == "__main__":
	main()




