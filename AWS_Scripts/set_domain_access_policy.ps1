# Set Access Policy for the given AWS search domain
#
# Before running you will need an AWS Access Key ID and an AWS Secret Access Key

$searchdomain = "connect-demo"

$policystring = "{
  \`"Version\`": \`"2012-10-17\`",
  \`"Statement\`": [
    {
      \`"Sid\`": \`"Stmt1491480352420\`",
      \`"Effect\`": \`"Allow\`",
      \`"Principal\`": \`"*\`",
      \`"Action\`": \`"cloudsearch:*\`",
      \`"Condition\`": {
        \`"IpAddress\`": {
          \`"aws:SourceIp\`": \`"8.8.8.8/32\`"
        }
      }
    }
  ]
}"


aws cloudsearch update-service-access-policies --domain-name "$searchdomain" --access-policies "$policystring"