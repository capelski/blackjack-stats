Feature: Final scores list

  The list of final scores resulting of a given list of hands groups the scores
  as expected and computes the final probabilities correctly

  Scenario: Hands list generation
    When getting the final scores list of a hand resolver with a stand threshold of 17
    Then the returned list contains 7 elements
    And the element 1 has score "17", probability "14.5126%" and "6640" hands
    And the element 7 has cards "22+", probability "28.1593%" and "46098" hands
