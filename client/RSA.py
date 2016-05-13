from Crypto.Cipher import PKCS1_OAEP
import Crypto.PublicKey.RSA
from Crypto.Random import get_random_bytes

class RSA():
	def __init__(self):
		self.keystring = ""

	def setKey(self, keyfilestring):
		f = open(keyfilestring, 'r')
		Key = f.read()
		if not Key:
			return False

		print(Key)
		self.keystring = Crypto.PublicKey.RSA.importKey(Key)


		return True

	def encrypt(self, plaintext):
		CHUNK_SIZE = 214 #amount to encrypt at a time
		ciphertext= b""
		cipher = PKCS1_OAEP.new(self.keystring)
		plaintext = bytes(plaintext, encoding="ascii") #converts to byte string
		for x in range(0, len(plaintext), CHUNK_SIZE):
			ciphertext += cipher.encrypt(plaintext[x:x+CHUNK_SIZE])

		return ciphertext


	def decrypt(self, ciphertext):
		CHUNK_SIZE = 256 #amount to decrypt at a time
		plaintext= b""
		cipher = PKCS1_OAEP.new(self.keystring)
		# plaintext += cipher.decrypt(ciphertext)
		for x in range(0, len(ciphertext), CHUNK_SIZE):
			plaintext += cipher.decrypt(ciphertext[x:x+CHUNK_SIZE])
		return plaintext