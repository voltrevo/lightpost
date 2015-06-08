#ifndef LP_PLUS_HPP
#define LP_PLUS_HPP

#include <cassert>

#include "boost/lexical_cast.hpp"

#include "frame.hpp"
#include "function.hpp"
#include "number.hpp"

namespace lp {

class plus : public function
{
public:
    virtual void exec(frame& f)
    {
        if (f.stack.size() < 2u)
        {
            f.error("plus: need 2 arguments, have " + boost::lexical_cast<std::string>(f.stack.size()));
            f.stack.clear();
            return;
        }

        item& arg1 = f.stack[f.stack.size() - 2];
        item& arg2 = f.stack[f.stack.size() - 1];

        if (arg1.type() != "number" || arg2.type() != "number")
        {
            f.error("plus: arguments must be numbers, received instead: " + arg1.type() + ", " + arg2.type());
            f.stack.pop_back();
            f.stack.pop_back();
            return;
        }

        double result = arg1.as_number() + arg2.as_number();
        f.stack.pop_back();
        f.stack.pop_back();
        f.stack.push_back(number(result));
    }
};

} // namespace lp

#endif // LP_PLUS_HPP
