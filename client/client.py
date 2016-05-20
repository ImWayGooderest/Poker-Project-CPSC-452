import RSA, requests, sys, json, base64, atexit, time

#global vars for now
private_key = b""
public_key = b""

# decrypts encrypted base64 string to json and then to a python dict
def decryptBase64toJSON(bytes):
	cipher = RSA.RSA()
	JSONstring = cipher.decrypt(base64.b64decode(bytes), private_key).decode("utf-8")
	return json.loads(JSONstring)

# signs in and receives a hand
def loginAndGetHand():
	hand = requests.post("http://localhost:3000/login", json=prepareData())
	if hand.status_code is not 200:
		print("Game is full!")
		sys.exit()
	else:
		return decryptBase64toJSON(hand.content)


# this function is called everytime the player plays a card
def playCard(card):
	print("You selected: " + str(card))
	data = {}
	data['card'] = card
	response = requests.post("http://localhost:3000/sendCard", json=prepareData(data))
	newHand = decryptBase64toJSON(response.content)
	while True:
		if newHand.get("err", 0) is not 0: # if there's an error print it to screen and go back to main
			print(newHand["err"])
			return 0
		else:
			if(newHand["msg"] == 0): # msg is 0 when other player didn't play yet. Becomes "You won the round" etc when the other player goes
				print("waiting for other player to play")
				response = requests.post("http://localhost:3000/checkForWinner", json=prepareData())
				newHand["msg"] = decryptBase64toJSON(response.content)["msg"]
			else: # msg contains who won
				response = requests.post("http://localhost:3000/getOpponentsCard", json=prepareData())
				newHand["opponentCard"] = decryptBase64toJSON(response.content)["opponentCard"] # get the card the opponent played to print to screen
				print("You played: " + str(card) + "\n" + "Your opponent played: " + str(newHand["opponentCard"]))
				print(newHand["msg"])
				return newHand["hand"]


# attaches session key in base64 to every POST to server
# make sure to call this function when sending a POST
# e.g. response = requests.post("http://localhost:3000/checkForWinner", json=prepareData())
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
			userInput = input("This is currently your hand, please select one: " + str(myHand) + "\n")
			if not userInput.isdigit() or int(userInput) < 0 or int(userInput) >= len(myHand):
				print("Please enter a valid index (0,1,2)")
			else:
				break
		tempHand = playCard(myHand[int(userInput)])
		if tempHand is not 0:
			myHand = tempHand
	
	time.sleep(30)
	sys.exit()



def logout():
	print("Bye")
	requests.get("http://localhost:3000/logout")

atexit.register(logout)



if __name__ == "__main__":
	main()




