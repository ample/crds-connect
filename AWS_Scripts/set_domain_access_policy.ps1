# Set Access Policy for the given AWS search domain
#
# Before running you will need an AWS Access Key ID and an AWS Secret Access Key

$searchdomain = "connect-prod"

$policystring = "{
  \`"Version\`": \`"2012-10-17\`",
  \`"Statement\`": [
    {
      \`"Effect\`": \`"Allow\`",
      \`"Principal\`": {
        \`"AWS\`": \`"arn:aws:iam::101165406591:user/connect_app\`"
      },
      \`"Action\`": \`"cloudsearch:*\`"
    }
  ]
}"


aws cloudsearch update-service-access-policies --domain-name "$searchdomain" --access-policies "$policystring"