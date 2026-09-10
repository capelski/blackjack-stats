Feature: Consequences

  The consequences for each different action are computed correctly

  Scenario: Stand consequence
    When getting the consequences of standing with "17" hand
    Then the consequence final probabilities equal "17=1"
    And the consequence edge equals "-0.29168840076149266"

  Scenario: Stand consequence BJ
    When getting the consequences of standing with "BJ" hand
    Then the consequence final probabilities equal "BJ=1"
    And the consequence edge equals "1.4289940828401995"

  Scenario: Future hands consequences (standing on 12+)
    When merging the following future consequences
      | NextCard | FinalProbabilities | Edge                   |
      | A        | 12=1               | -0.4368143052667273    |
      | 2        | 13=1               | -0.4368143052667273    |
      | 3        | 14=1               | -0.4368143052667273    |
      | 4        | 15=1               | -0.4368143052667273    |
      | 5        | 16=1               | -0.4368143052667273    |
      | 6        | 17=1               | -0.29168840076149266   |
      | 7        | 18=1               | -0.0070655694047901604 |
      | 8        | 19=1               | 0.26589531303286473    |
      | 9        | 20=1               | 0.5796116925287209     |
      | 10       | 21=1               | 0.8325947801126738     |
      | J        | 21=1               | 0.8325947801126738     |
      | Q        | 21=1               | 0.8325947801126738     |
      | K        | 21=1               | 0.8325947801126738     |
    Then the consequence final probabilities equal "12=0.07692307692307693,13=0.07692307692307693,14=0.07692307692307693,15=0.07692307692307693,16=0.07692307692307693,17=0.07692307692307693,18=0.07692307692307693,19=0.07692307692307693,20=0.07692307692307693,21=0.3076923076923077"
    And the consequence edge equals "0.13023543303941246"

  Scenario: Surrender consequence
    When getting the consequences of surrendering
    Then the consequence final probabilities equal "Surrender=1"
    And the consequence edge equals "-0.5"
