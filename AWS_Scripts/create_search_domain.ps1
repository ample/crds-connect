# Create or Update the definition of the aws-cloudsearch domain
#
# Before running you will need an AWS Access Key ID and an AWS Secret Access Key

$searchdomain = "connect-prod"

aws cloudsearch create-domain --domain-name "$searchdomain"

aws cloudsearch define-index-field --domain-name "$searchdomain" --name addressid --type int
aws cloudsearch define-index-field --domain-name "$searchdomain" --name city --type text
aws cloudsearch define-index-field --domain-name "$searchdomain" --name contactid --type int
aws cloudsearch define-index-field --domain-name "$searchdomain" --name emailaddress --type text
aws cloudsearch define-index-field --domain-name "$searchdomain" --name firstname --type text
aws cloudsearch define-index-field --domain-name "$searchdomain" --name groupdescription --type text
aws cloudsearch define-index-field --domain-name "$searchdomain" --name groupid --type int
aws cloudsearch define-index-field --domain-name "$searchdomain" --name groupname --type text
aws cloudsearch define-index-field --domain-name "$searchdomain" --name grouptypeid --type int
aws cloudsearch define-index-field --domain-name "$searchdomain" --name hoststatus --type int
aws cloudsearch define-index-field --domain-name "$searchdomain" --name householdid --type int
aws cloudsearch define-index-field --domain-name "$searchdomain" --name lastname --type text
aws cloudsearch define-index-field --domain-name "$searchdomain" --name latlong --type latlon
aws cloudsearch define-index-field --domain-name "$searchdomain" --name participantcount --type int
aws cloudsearch define-index-field --domain-name "$searchdomain" --name participantid --type int
aws cloudsearch define-index-field --domain-name "$searchdomain" --name pintype --type int
aws cloudsearch define-index-field --domain-name "$searchdomain" --name primarycontactemail --type text
aws cloudsearch define-index-field --domain-name "$searchdomain" --name primarycontactid --type int
aws cloudsearch define-index-field --domain-name "$searchdomain" --name sitename --type text
aws cloudsearch define-index-field --domain-name "$searchdomain" --name state --type text
aws cloudsearch define-index-field --domain-name "$searchdomain" --name zip --type text

