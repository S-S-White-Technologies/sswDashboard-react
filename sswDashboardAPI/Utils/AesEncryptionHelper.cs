using System.Security.Cryptography;
using System.Text;

public static class AesEncryptionHelper
{
    public static string DecryptOldVB(
     string cipherText,
     string passPhrase,
     string saltValue,
     string hashAlgorithm,
     int passwordIterations,
     string initVector,
     int keySizeBits)
    {
        byte[] initVectorBytes = Encoding.ASCII.GetBytes(initVector);
        byte[] saltValueBytes = Encoding.ASCII.GetBytes(saltValue);
        byte[] cipherTextBytes = Convert.FromBase64String(cipherText);

        using (var password = new Rfc2898DeriveBytes(passPhrase, saltValueBytes, passwordIterations, HashAlgorithmName.SHA1))
        {
            byte[] keyBytes = password.GetBytes(keySizeBits / 8);

            using (var symmetricKey = new RijndaelManaged())
            {
                symmetricKey.Mode = CipherMode.CBC;
                symmetricKey.Padding = PaddingMode.PKCS7;

                using (var decryptor = symmetricKey.CreateDecryptor(keyBytes, initVectorBytes))
                using (var memoryStream = new MemoryStream(cipherTextBytes))
                using (var cryptoStream = new CryptoStream(memoryStream, decryptor, CryptoStreamMode.Read))
                using (var reader = new StreamReader(cryptoStream, Encoding.UTF8))
                {
                    return reader.ReadToEnd();
                }
            }
        }
    }

}
