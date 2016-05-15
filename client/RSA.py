from Crypto.Cipher import PKCS1_OAEP
import Crypto.PublicKey.RSA
from Crypto.Random import get_random_bytes

class RSA():
	def __init__(self):
		self.keystring = ""

	# code sample from https://gist.github.com/lkdocs/6519378
	def getKey(self):
		key = Crypto.PublicKey.RSA.generate(1024, e=65537)
		public_key = key.publickey().exportKey("PEM")
		private_key = key.exportKey("PEM")
		return private_key, public_key

	def setKey(self, key):
		# f = open(keyfilestring, 'r')
		# Key = f.read()
		# if not Key:
		# 	return False
		#
		# print(Key)
		self.keystring = Crypto.PublicKey.RSA.importKey(key)


		return True

	def encrypt(self, plaintext, key):
		CHUNK_SIZE = 214 #amount to encrypt at a time
		ciphertext= b""
		cipher = PKCS1_OAEP.new(Crypto.PublicKey.RSA.importKey(key))
		plaintext = bytes(plaintext, encoding="ascii") #con+verts to byte string
		for x in range(0, len(plaintext), CHUNK_SIZE):
			ciphertext += cipher.encrypt(plaintext[x:x+CHUNK_SIZE])

		return ciphertext


	def decrypt(self, ciphertext, key):
		CHUNK_SIZE = 256 #amount to decrypt at a time
		plaintext= b""
		cipher = PKCS1_OAEP.new(Crypto.PublicKey.RSA.importKey(key))
		# plaintext += cipher.decrypt(ciphertext)
		for x in range(0, len(ciphertext), CHUNK_SIZE):
			plaintext += cipher.decrypt(ciphertext[x:x+CHUNK_SIZE])
		return plaintext