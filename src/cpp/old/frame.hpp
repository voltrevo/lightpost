#ifndef LP_FRAME_HPP
#define LP_FRAME_HPP

#include <string>
#include <vector>

#include "item.hpp"

namespace lp {

struct frame
{
    std::vector<std::unique_ptr<item>> stack;

    template <typename type, typename args...>
    void push(args&&... args)
    {
        stack.push_back(std::unique_ptr<type>(std::forward<args>(args)));
    }
    
    void error(const std::string&) { }
};

} // namespace lp

#endif // LP_FRAME_HPP
