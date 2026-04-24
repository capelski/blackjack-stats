Feature: Hands list

  The list of hands resulting of a given hand resolver is generated in the
  expected order

  Scenario: Hands list generation
    When getting the hands list of a hand resolver with a stand threshold of 17
    Then the returned list contains 86099 elements
    And the element 1 has cards "A,A", score "2/12", probability "0.5917%" and action "Hit"
    And the element 86099 has cards "K,K", score "20", probability "0.5917%" and action "Stand"
