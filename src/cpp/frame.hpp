#ifndef LP_FRAME_HPP
#define LP_FRAME_HPP

#include <vector>

#include "item.hpp"

namespace lp {

struct frame
{
    std::vector<item> stack;
    std::vector<item> variables;
};

} // namespace lp

#endif // LP_FRAME_HPP
