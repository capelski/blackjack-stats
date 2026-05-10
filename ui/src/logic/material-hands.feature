Feature: Material hands

  The material hands list resulting of a given hand resolver is generated in the expected order

  Scenario: Material hands for stand threshold
    When getting the material hands of a hand resolver with a stand threshold of 17
    Then 86099 material hands are returned
    And the material hand 1 has cards "A,A", score "2/12", probability "0.00591715976331361" and action "Hit"
    And the material hand 86099 has cards "K,K", score "20", probability "0.00591715976331361" and action "Stand"
    And there is a material hand with cards "10,5", probability "0.00591715976331361" and action "Hit"

  Scenario: Material hands for optimal roi
    When getting the material hands of a hand resolver for optimal roi
    Then 26923 material hands are returned
    And the material hand 1 has cards "A,A", score "2/12", probability "0.00591715976331361" and action "Hit"
    And the material hand 26923 has cards "K,K", score "20", probability "0.00591715976331361" and action "Stand"
    And there is a material hand with cards "10,5", probability "0.00591715976331361" and action "Stand"

  Scenario: Material hands for optimal roi with doubling
    Given doubling is allowed
    When getting the material hands of a hand resolver for optimal roi
    Then 19006 material hands are returned
    And there is a material hand with cards "5,6", probability "0.00591715976331361", action "Double" and bet multiplier "2"
    And there is a material hand with cards "5,6,A", probability "0.0004551661356395085", action "End" and bet multiplier "2"

  Scenario: Material hands for optimal roi with splitting
    Given splitting is allowed
    When getting the material hands of a hand resolver for optimal roi
    Then 23660 material hands are returned
    And there is a material hand with cards "A,A", probability "0.00591715976331361", action "Split" and bet multiplier "2"
    And there is a material post split hand with cards "A,A", probability "0.0004551661356395085", action "End" and bet multiplier "2"
    And there is a material hand with cards "8,8", probability "0.00591715976331361", action "Split" and bet multiplier "2"
    And there is a material post split hand with cards "8,2", probability "0.0004551661356395085", action "Hit" and bet multiplier "2"

  Scenario: Material hands for optimal roi with hit split aces
    Given splitting is allowed
    And hitting split aces is allowed
    When getting the material hands of a hand resolver for optimal roi
    Then 30615 material hands are returned
    And there is a material post split hand with cards "A,A", probability "0.0004551661356395085", action "Hit" and bet multiplier "2"

  Scenario: Material hands for optimal roi with doubling and splitting
    Given doubling is allowed
    And splitting is allowed
    When getting the material hands of a hand resolver for optimal roi
    Then 15743 material hands are returned

  Scenario: Material hands for optimal roi with doubling after splitting is allowed
    Given doubling is allowed
    And splitting is allowed
    And doubling after splitting is allowed
    When getting the material hands of a hand resolver for optimal roi
    Then 15561 material hands are returned
    And there is a material post split hand with cards "8,2", probability "0.0004551661356395085", action "Double" and bet multiplier "4"
    And there is a material post split hand with cards "8,2,6", probability "0.00003501277966457758", action "End" and bet multiplier "4"
