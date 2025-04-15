# Curiosity Report - various IAC's

## General
Terraform is a great tool for  for supporting on prem, AWS, Azure and others. OpenTofu was forked from Terraform and is an opensourced platform (rather than being managed by Hashicorp). 
Pulumi is great for using a programming languages like TS, Python, or Go to declare your resources. 

## Cloud Specefic IAC's
```
Google Deployment Manager, Azure ARM, and AWS CloudFormation are all the specefic IAC's for Google, Microsoft and Amazon. However all of these only work on those providers rather than on multiple platforms or on-prem services. Being able to quickly shift to another provider may not be an issue for most companies, unless you disagree with them. an example of a company that could have benefited from this was Parler ("American alt-tech social networking service associated with conservatives." - Wikapedia). Parler allowed various things that other social medias did not allow such as intellectual property, personal info, spam and illegal activites. They claimed that if someone could say it on the streets of New York that they could allow it on their platform. Apple, Google and Amazon all disagreed with them and took them off the App Store, Google play store and AWS shut their servers down. If parler launched their app on another cloud provider they potentially could have kept their platform more alive than it is now (and maybe that cloud provider would have removed them too). Parler purchased their own Cloud Technologies company and now runs thier own.

I hope organizations/universities like The Church/BYU never become the enemy. Using Terraform might be a way to quickly shift over to a new cloud provider (TRY THAT FOR A CHAOS TEST!) 

However if you're building a company, chances are the cloud providers won't be targeting your company becuase of who you are. We have seen rare cases such as extremists targeting Tesla because of Elon Musk. For the uncertain future it might be a good idea to be able to deploy to various cloud providers (or on prem) on the fly -- but is it really worth the extra effort/time with limited resources and with how low the probability is? It might be good to choose an IAC that is not GDM, Azure ARM, or AWS CloudFormation to ensure that if a change was needed that it would be simpler to move.
```

## Terraform vs. OpenTofu
```
Terraform has been one of the industries leading iac's. Owned and managed by Hashicorp, Terraform's code was originally released with the Mozilla Public Licence (permissive open-source licence) andhten moved to the business source licence (allows users to view and modify the source code). Because of this OpenTofu forked Terraform and made it completely open source. It's a bit of a tug of war against community driven software and business. In usage however they tend to be very similar.
```

## Other IAC's
```
Although Terraform and OpenTofu are very popular, Pulumi is another IAC that is becoming more used. It allows teams to develop their infrastructure in TS, Python or Go rather than in HCL(HashiCorp Configuration Language)/Json.

Salt Cloud is another alternative. Terraform is easier to learn as it has an easier process. Users reported that SaltStack slightly excells Terraform in automation capabilities (https://www.g2.com/compare/hashicorp-terraform-vs-saltstack). 
```

## My Recommendation
``` 
I have developed Infrastructure in AWS CloudFormation, Terraform and OpenTofu. I like OpenTofu the most as you can do slightly more with it. It's easier to develop dev/stg/prd/test envs in OpenTofu as you just have to make a new .env file in the same dir as your setup and main directories rather than duplicating the same setup and main directories for each env you develop. IAC is powerful and it's getting better. OpenTofu is my choice. 
```
