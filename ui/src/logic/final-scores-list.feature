Feature: Final scores list

  The list of final scores resulting of a given list of hands groups the scores
  as expected and computes the final probabilities correctly

  Scenario: Bet multipliers probability
    Given the final score "17" of a hand resolver with a stand threshold of 17
    When getting the probability by bet multiplier
    Then the returned probabilities are "1=0.14512590450523458"

  Scenario: Bet multipliers probability with doubling
    Given the final score "17" of a hand resolver for optimal roi with doubling
    When getting the probability by bet multiplier
    Then the returned probabilities are "1=0.10335329705103159,2=0.008169993882086491"

  Scenario: Final scores for stand threshold
    When getting the final scores list of a hand resolver with a stand threshold of 17
    Then the returned final scores list contains 7 elements
    And the final score 1 has score "17", probability "0.14512590450523458" and "6640" hands
    And the final score 7 has cards "22+", probability "0.2815928473666239" and "46098" hands

  Scenario: Final scores for optimal roi
    When getting the final scores list of a hand resolver for optimal roi
    Then the returned final scores list contains 9 elements
    And the final score 1 has score "15", probability "0.12627279484635673" and "2104" hands
    And the final score 9 has cards "22+", probability "0.1375096477714669" and "9882" hands

  Scenario: Final scores for optimal roi with doubling
    Given doubling is allowed
    When getting the final scores list of a hand resolver for optimal roi
    Then the returned final scores list contains 12 elements
    And the final score 1 has score "12", probability "0.008169993882086491" and "87" hands
    And the final score 12 has cards "22+", probability "0.12723858582229794" and "6576" hands

  Scenario: Final scores for optimal roi with splitting
    Given splitting is allowed
    When getting the final scores list of a hand resolver for optimal roi
    Then the returned final scores list contains 12 elements
    And the final score 1 has score "12", probability "0.0004551661356395085" and "1" hands
    And the final score 12 has cards "22+", probability "0.13714939336279428" and "8671" hands

  Scenario: Final scores for optimal roi with hit split aces
    Given splitting is allowed
    And hitting split aces is allowed
    When getting the final scores list of a hand resolver for optimal roi
    Then the returned final scores list contains 9 elements
    And the final score 1 has score "15", probability "0.12680333693078205" and "2396" hands
    And the final score 9 has cards "22+", probability "0.1375647216196502" and "11237" hands

  Scenario: Final scores for optimal roi with doubling and splitting
    Given doubling is allowed
    And splitting is allowed
    When getting the final scores list of a hand resolver for optimal roi
    Then the returned final scores list contains 12 elements
    And the final score 1 has score "12", probability "0.008625160017726001" and "88" hands
    And the final score 12 has cards "22+", probability "0.1268783314136255" and "5365" hands

  Scenario: Final scores for optimal roi with doubling and splitting
    Given doubling is allowed
    And splitting is allowed
    When getting the final scores list of a hand resolver for optimal roi
    Then the returned final scores list contains 12 elements
    And the final score 1 has score "12", probability "0.008625160017726001" and "88" hands
    And the final score 12 has cards "22+", probability "0.1268783314136255" and "5365" hands

  Scenario: Final scores for optimal roi with doubling and splitting
    Given doubling is allowed
    And splitting is allowed
    And doubling after splitting is allowed
    When getting the final scores list of a hand resolver for optimal roi
    Then the returned final scores list contains 12 elements
    And the final score 1 has score "12", probability "0.008695185577055155" and "90" hands
    And the final score 12 has cards "22+", probability "0.1267902974605682" and "5289" hands
