#ifndef LP_ITEM_HPP
#define LP_ITEM_HPP

#include <string>
#include <vector>

namespace lp {

class frame;

class item
{
public:
    virtual std::string type() const = 0;
    virtual double as_number() const = 0;
    virtual std::string as_string() const = 0;
    virtual void exec(frame&) const = 0;
    
    virtual bool is_variable() const = 0;
    virtual void assign(const item&) = 0;
};

} // namespace lp

#endif // LP_ITEM_HPP
