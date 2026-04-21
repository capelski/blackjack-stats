Feature: Bet multiplier

  Scenario: Default bet multiplier
    When getting the bet multiplier
    Then the returned value is 1

  Scenario: Blackjack bet multiplier
    When getting the bet multiplier for a blackjack hand
    Then the returned value is 1.5

  Scenario: Doubled bet multiplier
    When getting the bet multiplier for a hand that doubled the bet
    Then the returned value is 2
