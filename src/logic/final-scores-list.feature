Feature: Final scores list

  The list of final scores resulting of a given list of hands groups the hands by
  final score and bet multiplier and computes the final probabilities correctly

  Scenario: Bet multiplier probability
    When getting the final score "17" with bet multiplier 1 of a hand resolver with a stand threshold of 17
    Then the final score probability is "0.14512590450523458"

  Scenario: Bet multiplier probability (BJ)
    When getting the final score "BJ" with bet multiplier 1.5 of a hand resolver with a stand threshold of 17
    Then the final score probability is "0.04733727810650889"

  Scenario: Bet multiplier probability with doubling
    Given doubling is allowed
    When getting the final score "17" with bet multiplier 1 of a hand resolver for optimal actions
    Then the final score probability is "0.10503004947229833"
    When getting the final score "17" with bet multiplier 2 of a hand resolver for optimal actions
    Then the final score probability is "0.006827492034592626"

  Scenario: Final scores for stand threshold
    When getting the final scores list of a hand resolver with a stand threshold of 17
    Then the returned final scores list contains 7 elements
    And the final score 1 has score "17", bet multiplier 1, probability "0.14512590450523458" and "6640" hands
    And the final score 6 has score "BJ", bet multiplier 1.5, probability "0.04733727810650889" and "8" hands
    And the final score 7 has score "22+", bet multiplier 1, probability "0.2815928473666239" and "46098" hands

  Scenario: Final scores for optimal actions
    When getting the final scores list of a hand resolver for optimal actions
    Then the returned final scores list contains 9 elements
    And the final score 1 has score "15", bet multiplier 1, probability "0.12627279484635673" and "2104" hands
    And the final score 9 has score "22+", bet multiplier 1, probability "0.1375096477714669" and "9882" hands

  Scenario: Final scores for optimal actions with doubling
    Given doubling is allowed
    When getting the final scores list of a hand resolver for optimal actions
    Then the returned final scores list contains 19 elements
    And the final score 1 has score "12", bet multiplier 2, probability "0.006827492034592626" and "15" hands
    And the final score 8 has score "17", bet multiplier 1, probability "0.10503004947229833" and "2080" hands
    And the final score 9 has score "17", bet multiplier 2, probability "0.006827492034592626" and "15" hands
    And the final score 19 has score "22+", bet multiplier 1, probability "0.12892633734836892" and "9312" hands

  Scenario: Final scores for optimal actions with splitting
    Given splitting is allowed
    When getting the final scores list of a hand resolver for optimal actions
    Then the returned final scores list contains 20 elements
    And the final score 1 has score "12", bet multiplier 2, probability "0.0004551661356395085" and "1" hands
    And the final score 19 has score "22+", bet multiplier 1, probability "0.13648913871486373" and "8557" hands
    And the final score 20 has score "22+", bet multiplier 2, probability "0.0006602546479305641" and "114" hands

  Scenario: Final scores for surrendered hands
    Given surrendering is allowed
    When getting the final scores list of a hand resolver for optimal actions that surrenders "16" hands
    Then the returned final scores list contains 10 elements
    And the final score 1 has score "Surrender", bet multiplier 0.5, probability "0.06508875739644972" and "11" hands
    And the final score 10 has score "22+", bet multiplier 1, probability "0.1375096477714669" and "9882" hands

  Scenario: Final scores for optimal actions with hit split aces
    Given splitting is allowed
    And hitting split aces is allowed
    When getting the final scores list of a hand resolver for optimal actions
    Then the returned final scores list contains 17 elements
    And the final score 1 has score "15", bet multiplier 1, probability "0.1257915806520974" and "1820" hands
    And the final score 2 has score "15", bet multiplier 2, probability "0.001011756278684669" and "576" hands
    And the final score 17 has score "22+", bet multiplier 2, probability "0.0010755829047864502" and "2680" hands

  Scenario: Final scores for optimal actions with doubling and splitting
    Given doubling is allowed
    And splitting is allowed
    When getting the final scores list of a hand resolver for optimal actions
    Then the returned final scores list contains 20 elements
    And the final score 1 has score "12", bet multiplier 2, probability "0.007282658170232134" and "16" hands
    And the final score 20 has score "22+", bet multiplier 2, probability "0.0006602546479305641" and "114" hands

  Scenario: Final scores for optimal actions with doubling after splitting
    Given doubling is allowed
    And splitting is allowed
    And doubling after splitting is allowed
    When getting the final scores list of a hand resolver for optimal actions
    Then the returned final scores list contains 30 elements
    And the final score 1 has score "12", bet multiplier 2, probability "0.007282658170232134" and "16" hands
    And the final score 2 has score "12", bet multiplier 4, probability "0.00007002555932915516" and "2" hands
    And the final score 30 has score "22+", bet multiplier 2, probability "0.0005722206948731555" and "38" hands

  Scenario: Final scores for optimal actions with blackjack after split
    Given splitting is allowed
    And blackjack after split is allowed
    When getting the final scores list of a hand resolver for optimal actions
    Then the returned final scores list contains 21 elements
    And the final score 18 has score "BJ", bet multiplier 1.5, probability "0.04733727810650889" and "8" hands
    And the final score 19 has score "BJ", bet multiplier 3, probability "0.001820664542558034" and "4" hands

  Scenario: Final scores by first card
    When getting the final scores by first card of a hand resolver with a stand threshold of 17
    Then the returned final scores map contains 10 elements
    And the final scores group "6" has an accumulated probability of "0.07692307692307622"
    And the final score "17" with bet multiplier 1 of the final scores group "6" has probability "0.16543817650334763" and "259" hands
    And the final scores group "10-K" has an accumulated probability of "0.307692307692307"
    And the final score "17" with bet multiplier 1 of the final scores group "10-K" has probability "0.11142433852261416" and "128" hands
    And the final score "BJ" with bet multiplier 1.5 of the final scores group "10-K" has probability "0.07692307692307711" and "4" hands
    And the final score "22+" with bet multiplier 1 of the final scores group "10-K" has probability "0.21210907661769818" and "888" hands
