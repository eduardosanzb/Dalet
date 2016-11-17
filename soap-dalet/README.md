## Dalet SOAP client

__Important note__
For this to work, I needed to modify the source code of the module soap
node_modules/soap/lib/wsdl.js
at line 1642 aprox.
What I did was to avoid the prefix in the soap object to be setted by the parent node.
Comment that line. DUde.

