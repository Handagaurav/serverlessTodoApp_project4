
import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { JwtPayload } from '../../auth/JwtPayload'

const cert = `-----BEGIN CERTIFICATE-----
MIIDCzCCAfOgAwIBAgIJIhpIpLhK5l/KMA0GCSqGSIb3DQEBCwUAMCMxITAfBgNV
BAMTGGdhdXJhdmhhbmRhLnVzLmF1dGgwLmNvbTAeFw0yMDA3MjEyMjI0MDFaFw0z
NDAzMzAyMjI0MDFaMCMxITAfBgNVBAMTGGdhdXJhdmhhbmRhLnVzLmF1dGgwLmNv
bTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMw9ebaRGdgMSC6ByBTD
aJYj1IoQicfTtlvxZ3f7I7k3k5k+p3GLHazhEqb4yOomp1zwZtMOSombqlqffP84
IM/BIOx3jTzVrBQHheixe8yGHvBGz+SiZuBGxgPq6X16AczSYqzwUEMKjBlZAy2L
pebd5Po/ewX4OhRVEk4E7KdqQZc9R+z3JuTvCSaKSmDlwDqpl3fHF8/m3u38SuZL
GFSJTjIUBkAcZDlZhT1dEtladx5aft8IgtL/pz8uJTBnsrZT7SPPPPXN7vtMpsxW
FSGH15sA9hKG12+9arxyTycWVCXJj61/EZ7VDbF5+UXHXYgpjpk8y1zYuyBSBS8E
UVMCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUMvkVmtqfnT/9
GFBr0piquYzxyAUwDgYDVR0PAQH/BAQDAgKEMA0GCSqGSIb3DQEBCwUAA4IBAQBo
e6LlOVyuZFK4S4PSrWWmqaFvAt4tQ7Bk6u6YhWn273OOPKwwBSPJ+EKG7wj/FU+u
hltTBDPKVQSV+eAypvBWF9xFEyDT1wuP4NidB8wjgnRn66cMy4p90hDlSgpQDHvu
/byPGnFK6PvhSZDo0pu48m4oWu9fU6jKUFzm0h0QwL7n7V374mLQAo+Mf+sJrucC
sQFbXb2TMPkQVv+y7YdaSqy4FCuVyXnN3WpXt/4LsFPuZfHdpimJCHwNmZ3+8Y6O
QumnJNHZzDhe7euzNCglKYztIqKYqbWUSpEvWCuBy3Yc4Yn1ZADofvRNxlGn2WKg
kLWz/uHjB9yL+DVQRiSz
-----END CERTIFICATE----
`

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  try {
    const JwtPayload = verifyToken(event.authorizationToken)
    console.log('User was authorized', JwtPayload)

    return {
      principalId: JwtPayload.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    console.log('User authorized', e.message)

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

function verifyToken(authHeader: string): JwtPayload {
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
}
