Feature: Labels

  Different aspects of a hand are considered when generating its label

  Scenario: Hard hand label
    When getting the label of a hand with cards "9,8"
    Then the returned value is "17"

  Scenario: Bust hand label
    When getting the label of a hand with cards "9,8,7"
    Then the returned value is "22+"

  Scenario: Soft hand label
    When getting the label of a hand with cards "9,A"
    Then the returned value is "10/20"

  Scenario: Blackjack label
    When getting the label of a hand with cards "A,J"
    Then the returned value is "BJ"

  Scenario: Blackjack label (splitting)
    Given splitting is enabled
    When getting the label of a hand with cards "A,J"
    Then the returned value is "BJ"

  Scenario: Blackjack label (post split)
    Given splitting is enabled
    When getting the label of a post split hand with cards "A,J"
    Then the returned value is "11/21 (S)"

  Scenario: Blackjack label (blackjackAfterSplit)
    Given splitting is enabled
    And blackjackAfterSplit is enabled
    When getting the label of a post split hand with cards "A,J"
    Then the returned value is "BJ (S)"

  Scenario: Pair hand label
    When getting the label of a hand with cards "8,8"
    Then the returned value is "16"

  Scenario: Pair hand label (splitting)
    Given splitting is enabled
    When getting the label of a hand with cards "8,8"
    Then the returned value is "8,8"

  Scenario: Pair hand label (post split)
    Given splitting is enabled
    When getting the label of a post split hand with cards "8,8"
    Then the returned value is "16 (S)"
