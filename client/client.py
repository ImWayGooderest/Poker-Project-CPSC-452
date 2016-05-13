import RSA, requests, sys

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
def getHand():
	hand = requests.get("http://localhost:3000/getHand")
	print(hand.json())
	return hand.json()

def sendSessionKey():
	test = requests.post("http://localhost:3000/sendKey", params=sessionKey)

def playCard():
	test = requests.get("http://localhost:3000/sendCard", params=card)


def main():
	hand = getHand()



if __name__ == "__main__":
	r =requests.get("http://localhost:3000/login")
	print(r.cookies['username'])
	main()



