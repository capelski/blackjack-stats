Feature: Hands list

  The list of hands resulting of a given hand resolver is generated in the
  expected order

  Scenario: Hands list generation
    When getting the hands list of a hand resolver with a stand threshold of 4
    Then the returned list contains 169 elements
    And the element 1 has cards "A,A"
    And the element 169 has cards "K,K"
