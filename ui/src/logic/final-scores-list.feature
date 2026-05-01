Feature: Final scores list

  The list of final scores resulting of a given list of hands groups the scores
  as expected and computes the final probabilities correctly

  Scenario: Hands list generation
    When getting the final scores list of a hand resolver with a stand threshold of 17
    Then the returned final scores list contains 7 elements
    And the final score 1 has score "17", probability "14.5126%" and "6640" hands
    And the final score 7 has cards "22+", probability "28.1593%" and "46098" hands

  Scenario: Bet multipliers probability
    Given the final score "17" of a hand resolver with a stand threshold of 17
    When getting the probability by bet multiplier
    Then the returned probabilities are "1=0.14512590450523458"
