Feature: Consequences

  The consequences for each different action are computed correctly

  Scenario: Stand consequence
    When getting the consequences of standing with "17" hand
    Then the consequence final probabilities equal "17=1"
    And the consequence outcomes equals "win: 1=0.2815928473666239 / push: 1=0.14512590450523458 / lose: 1=0.5732812481281165"
    And the consequence edge equals "-0.29168840076149266"

  Scenario: Stand consequence BJ
    When getting the consequences of standing with "BJ" hand
    Then the consequence final probabilities equal "BJ=1"
    And the consequence outcomes equals "win: 1.5=0.9526627218934662 / push: 1.5=0.04733727810650889 / lose: 1.5=0"
    And the consequence edge equals "1.4289940828401995"

  Scenario: Future hands consequences (standing on 12+)
    Given the following list of future consequences
      | NextCard | FinalProbabilities | Outcomes                                                                               | Edge                   |
      |  A       | 12=1               |  win: 1=0.2815928473666239 / push: 1=0 / lose: 1=0.7184071526333512                    | -0.4368143052667273    |
      |  2       | 13=1               |  win: 1=0.2815928473666239 / push: 1=0 / lose: 1=0.7184071526333512                    | -0.4368143052667273    |
      |  3       | 14=1               |  win: 1=0.2815928473666239 / push: 1=0 / lose: 1=0.7184071526333512                    | -0.4368143052667273    |
      |  4       | 15=1               |  win: 1=0.2815928473666239 / push: 1=0 / lose: 1=0.7184071526333512                    | -0.4368143052667273    |
      |  5       | 16=1               |  win: 1=0.2815928473666239 / push: 1=0 / lose: 1=0.7184071526333512                    | -0.4368143052667273    |
      |  6       | 17=1               |  win: 1=0.2815928473666239 / push: 1=0.14512590450523458 / lose: 1=0.5732812481281165  | -0.29168840076149266   |
      |  7       | 18=1               |  win: 1=0.4267187518718585 / push: 1=0.13949692685146792 / lose: 1=0.4337843212766486  | -0.0070655694047901604 |
      |  8       | 19=1               |  win: 1=0.5662156787233263 / push: 1=0.13346395558618693 / lose: 1=0.3003203656904617  | 0.26589531303286473    |
      |  9       | 20=1               |  win: 1=0.6996796343095133 / push: 1=0.1802524239096693 / lose: 1=0.12006794178079239  | 0.5796116925287209     |
      |  10      | 21=1               |  win: 1=0.8799320582191827 / push: 1=0.07273066367428349 / lose: 1=0.04733727810650889 | 0.8325947801126738     |
      |  J       | 21=1               |  win: 1=0.8799320582191827 / push: 1=0.07273066367428349 / lose: 1=0.04733727810650889 | 0.8325947801126738     |
      |  Q       | 21=1               |  win: 1=0.8799320582191827 / push: 1=0.07273066367428349 / lose: 1=0.04733727810650889 | 0.8325947801126738     |
      |  K       | 21=1               |  win: 1=0.8799320582191827 / push: 1=0.07273066367428349 / lose: 1=0.04733727810650889 | 0.8325947801126738     |
    When getting the consequences of hitting
    Then the consequence final probabilities equal "12=0.07692307692307693,13=0.07692307692307693,14=0.07692307692307693,15=0.07692307692307693,16=0.07692307692307693,17=0.07692307692307693,18=0.07692307692307693,19=0.07692307692307693,20=0.07692307692307693,21=0.3076923076923077"
    And the consequence outcomes equals "win: 1=0.5309153370754748 / push: 1=0.0684047588884379 / lose: 1=0.4006799040360623"
    And the consequence edge equals "0.13023543303941248"
    When getting the consequences of doubling or splitting
    Then the consequence final probabilities equal "12=0.07692307692307693,13=0.07692307692307693,14=0.07692307692307693,15=0.07692307692307693,16=0.07692307692307693,17=0.07692307692307693,18=0.07692307692307693,19=0.07692307692307693,20=0.07692307692307693,21=0.3076923076923077"
    And the consequence outcomes equals "win: 2=0.5309153370754748 / push: 2=0.0684047588884379 / lose: 2=0.4006799040360623"
    And the consequence edge equals "0.26047086607882497"