import RSA, requests, sys, json, base64, atexit

#global vars for now
private_key = b""
public_key = b""

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
	print("You selected: " + str(card))
	data = {}
	data['card'] = card
	response = requests.post("http://localhost:3000/sendCard", json=prepareData(data))
	newHand = decryptBase64toJSON(response.content)
	while True:
		if newHand.get("err", 0) is not 0:
			print(newHand["err"])
			return 0
		else:
			if(newHand["msg"] == 0):
				print("waiting for other player to play")
				response = requests.post("http://localhost:3000/checkForWinner", json=prepareData())
				newHand["msg"] = decryptBase64toJSON(response.content)["msg"]
			else:
				print(newHand["msg"])
				return newHand["hand"]


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
		while True:
			userInput = input("This is currently your hand, please select one: " + str(myHand) + "\n") #probably a better way to write this
			if int(userInput) < 0 or int(userInput) >= len(myHand):
				print("Please enter a valid index (0,1,2)")
			else:
				break;
		tempHand = playCard(myHand[int(userInput)])
		if tempHand is not 0: # need
			myHand = tempHand

	print (requests.get("http://localhost:3000/gameWinner").content["end"])


def logout():
	print("Bye")
	requests.get("http://localhost:3000/logout")

atexit.register(logout)


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




