Feature: Result

  The final result is determined from comparing the player and dealer scores

  Scenario: Player wins
    When resolving a player score of "19" against a dealer score of "17"
    Then result is "Win"

  Scenario: Player pushes
    When resolving a player score of "18" against a dealer score of "18"
    Then result is "Push"

  Scenario: Player loses
    When resolving a player score of "16" against a dealer score of "20"
    Then result is "Lose"

  Scenario: Player busts
    When resolving a player score of "22+" against a dealer score of "20"
    Then result is "Lose"

  Scenario: Dealer busts
    When resolving a player score of "16" against a dealer score of "22+"
    Then result is "Win"

  Scenario: Player and dealer bust
    When resolving a player score of "22+" against a dealer score of "22+"
    Then result is "Lose"

  Scenario: Player blackjack
    When resolving a player score of "BJ" against a dealer score of "21"
    Then result is "Win"

  Scenario: Dealer blackjack
    When resolving a player score of "21" against a dealer score of "BJ"
    Then result is "Lose"

  Scenario: Dealer blackjack
    When resolving a player score of "BJ" against a dealer score of "BJ"
    Then result is "Push"
