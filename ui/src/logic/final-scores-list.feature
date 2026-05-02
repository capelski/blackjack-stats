Feature: Final scores list

  The list of final scores resulting of a given list of hands groups the scores
  as expected and computes the final probabilities correctly

  Scenario: Stand threshold final scores
    When getting the final scores list of a hand resolver with a stand threshold of 17
    Then the returned final scores list contains 7 elements
    And the final score 1 has score "17", probability "0.14512590450523458" and "6640" hands
    And the final score 7 has cards "22+", probability "0.2815928473666239" and "46098" hands

  Scenario: Optimal ROI final scores
    When getting the final scores list of a hand resolver for optimal roi
    Then the returned final scores list contains 9 elements
    And the final score 1 has score "15", probability "0.12627279484635673" and "2104" hands
    And the final score 9 has cards "22+", probability "0.1375096477714669" and "9882" hands

  Scenario: Bet multipliers probability
    Given the final score "17" of a hand resolver with a stand threshold of 17
    When getting the probability by bet multiplier
    Then the returned probabilities are "1=0.14512590450523458"
