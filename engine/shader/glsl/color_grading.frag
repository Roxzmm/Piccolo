#version 310 es

#extension GL_GOOGLE_include_directive : enable

#include "constants.h"

layout(input_attachment_index = 0, set = 0, binding = 0) uniform highp subpassInput in_color;

layout(set = 0, binding = 1) uniform sampler2D color_grading_lut_texture_sampler;

layout(location = 0) out highp vec4 out_color;

void main()
{
    highp ivec2 lut_tex_size = textureSize(color_grading_lut_texture_sampler, 0);
    highp float _COLORS      = float(lut_tex_size.y);

    highp vec4 color       = subpassLoad(in_color).rgba;
    
    // texture(color_grading_lut_texture_sampler, uv)

    highp float x = float(lut_tex_size.x), y = float(lut_tex_size.y);
    highp float u, v;
    u = floor(color.b * (y - 1.0f)) / (y - 1.0f) * (x - y);
    u += (color.r * (y - 1.0f));
    u /= (x - 1.0f);
    v = color.g;
    highp vec2 uv = vec2(u, v);
    
    highp vec3 lut_color1 = texture(color_grading_lut_texture_sampler, uv).rgb;
    highp vec3 lut_color2 = texture(color_grading_lut_texture_sampler, uv + vec2(1.0f / (y - 1.0f) * (x - y) / (x - 1.0f), 0)).rgb;
    
    color.rgb = mix(lut_color1, lut_color2, fract(color.b * (y - 1.0f)));

    out_color = color;
}
