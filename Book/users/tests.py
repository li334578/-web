from django.test import TestCase

# Create your tests here.
import re



m = '^[a-zA-Z0-9_-]{4,16}$'
if re.match(m,'adasdasn1'):
    print("success")
else:
    print("none")
print(re.match(m,'admin1'))
