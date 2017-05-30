# Create or Update the definition of the aws-cloudsearch domain
#
# Before running you will need an AWS Access Key ID and an AWS Secret Access Key

$searchdomain = "connect-dev"

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
aws cloudsearch define-index-field --domain-name "$searchdomain" --name groupstartdate --type text
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

# Additional fields for group tool

aws cloudsearch define-index-field --domain-name "$searchdomain" --name groupcategory --type literal-array
aws cloudsearch define-index-field --domain-name "$searchdomain" --name grouptype --type literal
aws cloudsearch define-index-field --domain-name "$searchdomain" --name groupagerange --type literal-array
aws cloudsearch define-index-field --domain-name "$searchdomain" --name groupmeetingday --type literal
aws cloudsearch define-index-field --domain-name "$searchdomain" --name groupmeetingtime --type literal
aws cloudsearch define-index-field --domain-name "$searchdomain" --name grouplocation --type literal
aws cloudsearch define-index-field --domain-name "$searchdomain" --name groupmeetingfrequency --type literal
aws cloudsearch define-index-field --domain-name "$searchdomain" --name groupkidswelcome --type int
aws cloudsearch define-index-field --domain-name "$searchdomain" --name groupprimarycontactfirstname --type text
aws cloudsearch define-index-field --domain-name "$searchdomain" --name groupprimarycontactlastname --type text
aws cloudsearch define-index-field --domain-name "$searchdomain" --name groupprimarycontactcongregation --type text
