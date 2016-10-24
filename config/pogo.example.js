var fs = require('fs');
var _ = require('lodash');

var defaults = {
    game: {
        fort_settings: {
            interaction_range_meters: 40.25098039215686,
            max_total_deployed_pokemon: 10,
            max_player_deployed_pokemon: 1,
            deploy_stamina_multiplier: 8.062745098039215,
            deploy_attack_multiplier: 0,
            far_interaction_range_meters: 1000.0156862745098
        },
        map_settings: {
            pokemon_visible_range: 999.00196078431372,
            poke_nav_range_meters: 751.0156862745098,
            encounter_range_meters: 999.25098039215686,
            get_map_objects_min_refresh_seconds: 16,
            get_map_objects_max_refresh_seconds: 16,
            get_map_objects_min_distance_meters: 10.007843017578125,
            google_maps_api_key: ''
        },
        inventory_settings: {
            max_pokemon: 1000,
            max_bag_items: 1000,
            base_pokemon: 250,
            base_bag_items: 350,
            base_eggs: 9
        },
        gps_settings: {
            driving_warning_speed_meters_per_second: 100,
            driving_warning_cooldown_minutes: 1000,
            driving_speed_sample_interval_seconds: 1000,
            driving_speed_sample_count: 1000
        },
        minimum_client_version: '0.35.0'
    },
    pkmn: {
        MIN_IV: 1,
        MAX_IV: 15
    },
    player: {
        name_changes: 5
    }
};

module.exports = defaults;