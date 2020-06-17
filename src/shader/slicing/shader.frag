#version 430 core
out vec4 fragment_color;

in vec3 fragment_pos;
in vec3 fragment_texture_pos;
in float check;

layout (binding = 0) uniform sampler1D texture_1d;
layout (binding = 1) uniform sampler3D texture_3d;

uniform vec3 light_pos;
uniform vec3 view_pos;
uniform vec3 light_color;


void main(){
    if (check < 0.0) {
        // discard;
    }

    vec4 hold = texture(texture_3d, fragment_texture_pos);

    float value = hold.w;
    vec3 normal = normalize(hold.xyz);

    vec4 object_color = texture(texture_1d, value);
    fragment_color = object_color;

    float magnitude = length(hold.xyz);
    magnitude = min(max(1.0, magnitude), 256.0);
    magnitude = 20 * log2(magnitude);


    vec3 light_direction = normalize(light_pos - fragment_pos);
    vec3 view_direction = normalize(view_pos - fragment_pos);


    if (dot(normal, -view_direction) < 0) {
        normal = -normal;
    }
    vec3 reflect_direction = reflect(-light_direction, normal);

    vec3 ambient = 0.01 * light_color;
    vec3 diffuse = max(dot(normal, light_direction), 0.0) * light_color;
    vec3 specular = 0.5 * pow(max(dot(view_direction, reflect_direction), 0.0), 8) * light_color;

    vec4 coefficient = vec4(clamp((ambient + diffuse + specular), vec3(0.0), vec3(1.0)), 1.0);
    
    vec4 result = coefficient * object_color;
    // fragment_color = vec4(result);
    // fragment_color = vec4(fragment_texture_pos.xyz, 0.01);
}
