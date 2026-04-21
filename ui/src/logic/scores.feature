Feature: Scores

  The scores of a hand are calculated based on its cards

  Scenario: Hard hand scores
    When getting the score of a hand with cards "9,8"
    Then the returned values are "17"

  Scenario: Bust hand scores
    When getting the score of a hand with cards "9,8,7"
    Then the returned values are "22"

  Scenario: Soft hand scores
    When getting the score of a hand with cards "9,A"
    Then the returned values are "10,20"

  Scenario: Soft hand with more than one A scores
    When getting the score of a hand with cards "A,A,A"
    Then the returned values are "3,13"

  Scenario: Hard hand with an A scores
    When getting the score of a hand with cards "9,8,A"
    Then the returned values are "18"

  Scenario: Blackjack scores
    When getting the score of a hand with cards "A,J"
    Then the returned values are "21.5"

  Scenario: Post-split 21 scores
    When getting the score of a post split hand with cards "A,J"
    Then the returned values are "11,21"
