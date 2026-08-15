Feature: Bet multiplier

  Scenario: Default bet multiplier
    When getting the bet multiplier
    Then the returned value is 1

  Scenario: Blackjack bet multiplier
    When getting the bet multiplier for a blackjack hand
    Then the returned value is 1.5

  Scenario: Blackjack after split bet multiplier
    When getting the bet multiplier for a blackjack hand after splitting
    Then the returned value is 3

  Scenario: Doubled hand bet multiplier
    When getting the bet multiplier for a hand that doubled the bet
    Then the returned value is 2

  Scenario: Surrendered hand bet multiplier
    When getting the bet multiplier for a hand that surrendered
    Then the returned value is 0.5
