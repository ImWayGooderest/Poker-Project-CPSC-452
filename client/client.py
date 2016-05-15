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

def loginAndGetHand():
	hand = requests.post("http://localhost:3000/login", json=prepareData())
	print(hand.json())
	return hand.json()

def playCard(card):
	test = requests.post("http://localhost:3000/sendCard", json=prepareData(card))

# attaches session key and eventually will encrypt
def prepareData(data=None):
	if(data==None):
		data = {}
	data["session_key_base64"] = base64.b64encode(public_key).decode()
	return data

def main():
	global public_key, private_key
	cipher = RSA.RSA()
	private_key, public_key = cipher.getKey()
	myHand = base64.b64decode(bytes(loginAndGetHand(), encoding="ascii"))
	# test stuff
	myHand = cipher.decrypt(myHand, private_key).decode().split() #decrypts, then bytestring to string, then convert string to list
	# myHand = getHand()	#assuming the randomized 3 cards return as a list
	userInput = input("This is currently your hand, please select one: " + str(myHand))
	# #print(myHand)	#somewhere here have user input?
	# playCard(userInput)		#have the user input be passed on to the server

	# hand = getHand()



if __name__ == "__main__":
	main()




