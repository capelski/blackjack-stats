Feature: Final scores list

  The list of final scores resulting of a given list of hands groups the scores
  as expected and computes the final probabilities correctly

  Scenario: Bet multipliers probability
    Given the final score "17" of a hand resolver with a stand threshold of 17
    When getting the probability by bet multiplier
    Then the returned probabilities are "1=1"

  Scenario: Bet multipliers probability (BJ)
    Given the final score "BJ" of a hand resolver with a stand threshold of 17
    When getting the probability by bet multiplier
    Then the returned probabilities are "1.5=1"

  Scenario: Bet multipliers probability with doubling
    Given doubling is allowed
    And the final score "17" of a hand resolver for optimal actions
    When getting the probability by bet multiplier
    Then the returned probabilities are "1=0.9389626131361736,2=0.06103738686382643"

  Scenario: Final scores for stand threshold
    When getting the final scores list of a hand resolver with a stand threshold of 17
    Then the returned final scores list contains 7 elements
    And the final score 1 has score "17", probability "0.14512590450523458" and "6640" hands
    And the final score 7 has cards "22+", probability "0.2815928473666239" and "46098" hands

  Scenario: Final scores for optimal actions
    When getting the final scores list of a hand resolver for optimal actions
    Then the returned final scores list contains 9 elements
    And the final score 1 has score "15", probability "0.12627279484635673" and "2104" hands
    And the final score 9 has cards "22+", probability "0.1375096477714669" and "9882" hands

  Scenario: Final scores for optimal actions with doubling
    Given doubling is allowed
    When getting the final scores list of a hand resolver for optimal actions
    Then the returned final scores list contains 12 elements
    And the final score 1 has score "12", probability "0.006827492034592626" and "15" hands
    And the final score 12 has cards "22+", probability "0.12892633734836892" and "9312" hands

  Scenario: Final scores for optimal actions with splitting
    Given splitting is allowed
    When getting the final scores list of a hand resolver for optimal actions
    Then the returned final scores list contains 12 elements
    And the final score 1 has score "12", probability "0.0004551661356395085" and "1" hands
    And the final score 12 has cards "22+", probability "0.13714939336279428" and "8671" hands

  Scenario: Final scores for optimal actions with hit split aces
    Given splitting is allowed
    And hitting split aces is allowed
    When getting the final scores list of a hand resolver for optimal actions
    Then the returned final scores list contains 9 elements
    And the final score 1 has score "15", probability "0.12680333693078205" and "2396" hands
    And the final score 9 has cards "22+", probability "0.1375647216196502" and "11237" hands

  Scenario: Final scores for optimal actions with doubling and splitting
    Given doubling is allowed
    And splitting is allowed
    When getting the final scores list of a hand resolver for optimal actions
    Then the returned final scores list contains 12 elements
    And the final score 1 has score "12", probability "0.007282658170232134" and "16" hands
    And the final score 12 has cards "22+", probability "0.12856608293969646" and "8101" hands

  Scenario: Final scores for optimal actions with doubling after splitting
    Given doubling is allowed
    And splitting is allowed
    And doubling after splitting is allowed
    When getting the final scores list of a hand resolver for optimal actions
    Then the returned final scores list contains 12 elements
    And the final score 1 has score "12", probability "0.0073526837295612895" and "18" hands
    And the final score 12 has cards "22+", probability "0.12847804898663914" and "8025" hands

  Scenario: Final scores for optimal actions with blackjack after split
    Given splitting is allowed
    And blackjack after split is allowed
    When getting the final scores list of a hand resolver for optimal actions
    Then the returned final scores list contains 12 elements
    And the final score 11 has score "BJ", probability "0.04915794264906692" and "12" hands
