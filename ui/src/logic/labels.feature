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

  Scenario: Post-split 21 label
    When getting the label of a post split hand with cards "A,J"
    Then the returned value is "11/21"

  Scenario: Pair hand label
    When getting the label of a hand with cards "8,8"
    Then the returned value is "8,8"

  Scenario: Post-split pair hand label
    When getting the label of a post split hand with cards "8,8"
    Then the returned value is "16"

    
